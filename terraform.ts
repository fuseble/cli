import yargs from "yargs";
import chalk from "chalk";
import { flatten, unflatten } from "flat";
import fsExtra from "fs-extra";
import ecsFargateJson from "./config/origin.tfvars.json/ecs-fargate.json";
import s3WebJson from "./config/origin.tfvars.json/s3-web.json";

export default class TerraformCLI {
  public static async getOptions() {
    const templateOptions = await yargs.usage(chalk.cyan("")).options({
      template: {
        alias: "template",
        type: "string",
        requiresArg: true,
      },
    }).argv;

    if (templateOptions.template === "ecs-fargate") {
      const options = await yargs
        .usage(chalk.cyan("ECS Fargate Options"))
        .options({
          template: {
            type: "string",
            requiresArg: true,
          },
          profile: {
            type: "string",
            default: "default",
            requiresArg: true,
          },
          region: {
            type: "string",
            default: "ap-northeast-2",
          },
          service: {
            type: "string",
          },
          ecr: {
            type: "string",
            requiresArg: true,
          },
          "root-domain": {
            alias: "root",
            type: "string",
            requiresArg: true,
          },
          "record-domain": {
            alias: "record",
            type: "string",
            requiresArg: true,
          },
          port: {
            type: "number",
            default: 8000,
          },
          "database-port": {
            alias: "database",
            type: "string",
            default: 3306,
          },
          "vpc-cidr": {
            alias: "vpc",
            type: "string",
            default: "10.0.0.0/16",
          },
          "instance-count": {
            alias: "instance",
            type: "number",
            default: 2,
          },
          "availability-zone": {
            alias: "zone",
            type: "string",
            default: "ap-northeast-2a,ap-northeast-2b",
          },
          "min-capacity": {
            alias: "min",
            type: "number",
            default: 1,
          },
          "max-capacity": {
            alias: "max",
            type: "number",
            default: 2,
          },
          "instance-cpu": {
            alias: "icpu",
            type: "number",
            default: 1024,
          },
          "instance-memory": {
            alias: "imem",
            type: "number",
            default: 2048,
          },
          "container-cpu": {
            alias: "ccpu",
            type: "number",
            default: 512,
          },
          "container-memory": {
            alias: "cmem",
            type: "number",
            default: 1024,
          },
        }).argv;

      if (!options.service || !options.ecr) {
        console.log(`Please provide a service name and ecr name`);
        process.exit(1);
      }

      if (!options.rootDomain || !options.recordDomain) {
        console.log("Please provide root and record domain");
        process.exit(1);
      }

      return options;
    }

    if (templateOptions.template === "s3-web") {
      const options = await yargs.usage(chalk.cyan("S3 Web Options")).options({
        template: {
          type: "string",
          requiresArg: true,
        },
        profile: {
          type: "string",
          default: "default",
          requiresArg: true,
        },
        region: {
          type: "string",
          default: "ap-northeast-2",
        },
        bucket: {
          type: "string",
          requiresArg: true,
        },
        "cloudfront-comment": {
          alias: "comment",
          type: "string",
        },
        "root-domain": {
          alias: "root",
          type: "string",
          requiresArg: true,
        },
        "record-domain": {
          alias: "record",
          type: "string",
          requiresArg: true,
        },
      }).argv;

      if (!options.bucket) {
        console.log(`Please provide a bucket name`);
        process.exit(1);
      }
      if (!options.cloudfrontComment) {
        options.cloudfrontComment = `S3 Web Hosting for ${options.bucket} by Terraform`;
      }
      if (!options.rootDomain || !options.recordDomain) {
        console.log("Please provide root and record domain");
        process.exit(1);
      }

      return options;
    }

    if (!templateOptions.template) {
      console.log(`Please provide a template name`);
      process.exit(1);
    }
  }

  public static writeECSFargateTFVars(argv) {
    const flattenFile = flatten(ecsFargateJson) as Record<string, any>;
    for (const [key, value] of Object.entries(flattenFile)) {
      if (
        typeof value !== "string" ||
        !value.includes("<") ||
        !value.includes(">")
      )
        continue;

      if (value.includes("<SERVICE_NAME>")) {
        flattenFile[key] = value.replace("<SERVICE_NAME>", argv.service);
      }
      if (value.includes("<ECR_REPO>")) {
        flattenFile[key] = argv.ecr;
      }
      if (value.includes("<PORT>")) {
        flattenFile[key] = argv.port;
      }
      if (value.includes("<DATABASE_PORT>")) {
        flattenFile[key] = argv.databasePort;
      }
      if (value.includes("<REGION>")) {
        flattenFile[key] = value.replace("<REGION>", argv.region);
      }
      if (value.includes("<AVAILABILITY_ZONE>")) {
        flattenFile[key] = argv.availabilityZone.split(",");
      }
      if (value.includes("<PROFILE>")) {
        flattenFile[key] = argv.profile;
      }
      if (value.includes("<VPC_CIDR>")) {
        flattenFile[key] = argv.vpcCidr;
      }
      if (value.includes("<ROOT_DOMAIN>")) {
        flattenFile[key] = value.replace("<ROOT_DOMAIN>", argv.rootDomain);
      }
      if (value.includes("<RECORD_DOMAIN>")) {
        flattenFile[key] = value.replace("<RECORD_DOMAIN>", argv.recordDomain);
      }
      if (value.includes("<MIN_CAPACITY>")) {
        flattenFile[key] = argv.minCapacity;
      }
      if (value.includes("<MAX_CAPACITY>")) {
        flattenFile[key] = argv.maxCapacity;
      }
      if (value.includes("<INSTANCE_COUNT>")) {
        flattenFile[key] = argv.instanceCount;
      }
      if (value.includes("<INSTANCE_CPU>")) {
        flattenFile[key] = argv.instanceCpu;
      }
      if (value.includes("<INSTANCE_MEMORY>")) {
        flattenFile[key] = argv.instanceMemory;
      }
      if (value.includes("<CONTAINER_CPU>")) {
        flattenFile[key] = argv.containerCpu;
      }
      if (value.includes("<CONTAINER_MEMORY>")) {
        flattenFile[key] = argv.containerMemory;
      }

      const newConfig = unflatten(flattenFile);

      fsExtra.writeJsonSync(`./variables.tfvars.json`, newConfig, {
        spaces: 2,
      });
    }
  }

  public static writeS3WebTFVars(argv) {
    const flattenFile = flatten(s3WebJson) as Record<string, any>;
    for (const [key, value] of Object.entries(flattenFile)) {
      if (
        typeof value !== "string" ||
        !value.includes("<") ||
        !value.includes(">")
      )
        continue;

      if (value.includes("<REGION>")) {
        flattenFile[key] = value.replace("<REGION>", argv.region);
      }
      if (value.includes("<PROFILE>")) {
        flattenFile[key] = argv.profile;
      }
      if (value.includes("<BUCKET_NAME>")) {
        flattenFile[key] = value.replace("<BUCKET_NAME>", argv.bucket);
      }
      if (value.includes("<CLOUDFRONT_COMMENT>")) {
        flattenFile[key] = argv.cloudfrontComment;
      }
      if (value.includes("<ROOT_DOMAIN>")) {
        flattenFile[key] = value.replace("<ROOT_DOMAIN>", argv.rootDomain);
      }
      if (value.includes("<RECORD_DOMAIN>")) {
        flattenFile[key] = value.replace("<RECORD_DOMAIN>", argv.recordDomain);
      }

      const newConfig = unflatten(flattenFile);

      fsExtra.writeJsonSync(`./variables.tfvars.json`, newConfig, {
        spaces: 2,
      });
    }
  }

  public static writeTFVars(argv) {
    if (argv.template === "ecs-fargate") {
      this.writeECSFargateTFVars(argv);
    }
    if (argv.template === "s3-web") {
      this.writeS3WebTFVars(argv);
    }
  }
}
