import { flatten, unflatten } from 'flat';
import fsExtra from 'fs-extra';
import { ECS_FARGATE_JSON } from '@/files';

const write = (argv: any) => {
  const flattenFile = flatten(ECS_FARGATE_JSON) as Record<string, any>;
  for (const [key, value] of Object.entries(flattenFile)) {
    if (typeof value !== 'string' || !value.includes('<') || !value.includes('>')) continue;

    if (value.includes('<SERVICE_NAME>')) {
      flattenFile[key] = value.replace('<SERVICE_NAME>', argv.service);
    }
    if (value.includes('<ECR_REPO>')) {
      flattenFile[key] = argv.ecr;
    }
    if (value.includes('<PORT>')) {
      flattenFile[key] = argv.port;
    }
    if (value.includes('<DATABASE_PORT>')) {
      flattenFile[key] = argv.databasePort;
    }
    if (value.includes('<REGION>')) {
      flattenFile[key] = value.replace('<REGION>', argv.region);
    }
    if (value.includes('<AVAILABILITY_ZONE>')) {
      flattenFile[key] = argv.availabilityZone.split(',');
    }
    if (value.includes('<PROFILE>')) {
      flattenFile[key] = argv.profile;
    }
    if (value.includes('<VPC_CIDR>')) {
      flattenFile[key] = argv.vpcCidr;
    }
    if (value.includes('<ROOT_DOMAIN>')) {
      flattenFile[key] = value.replace('<ROOT_DOMAIN>', argv.rootDomain);
    }
    if (value.includes('<RECORD_DOMAIN>')) {
      flattenFile[key] = value.replace('<RECORD_DOMAIN>', argv.recordDomain);
    }
    if (value.includes('<MIN_CAPACITY>')) {
      flattenFile[key] = argv.minCapacity;
    }
    if (value.includes('<MAX_CAPACITY>')) {
      flattenFile[key] = argv.maxCapacity;
    }
    if (value.includes('<INSTANCE_COUNT>')) {
      flattenFile[key] = argv.instanceCount;
    }
    if (value.includes('<INSTANCE_CPU>')) {
      flattenFile[key] = argv.instanceCpu;
    }
    if (value.includes('<INSTANCE_MEMORY>')) {
      flattenFile[key] = argv.instanceMemory;
    }
    if (value.includes('<CONTAINER_CPU>')) {
      flattenFile[key] = argv.containerCpu;
    }
    if (value.includes('<CONTAINER_MEMORY>')) {
      flattenFile[key] = argv.containerMemory;
    }

    const newConfig = unflatten(flattenFile);

    fsExtra.writeJsonSync(`./variables.tfvars.json`, newConfig, {
      spaces: 2,
      encoding: 'utf8',
    });
  }
};

export default write;
