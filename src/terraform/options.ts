import yargs from 'yargs';
import chalk from 'chalk';

const getOptions = async (): Promise<any> => {
  const argv = await yargs.usage(chalk.cyan('')).options({
    template: {
      alias: 'template',
      type: 'string',
      requiresArg: true,
    },
  }).argv;

  if (argv.template === 'ecs-fargate') {
    const options = await yargs.usage(chalk.cyan('ECS Fargate Options')).options({
      template: {
        type: 'string',
        requiresArg: true,
      },
      profile: {
        type: 'string',
        default: 'default',
        requiresArg: true,
      },
      region: {
        type: 'string',
        default: 'ap-northeast-2',
      },
      service: {
        type: 'string',
      },
      ecr: {
        type: 'string',
        requiresArg: true,
      },
      'root-domain': {
        alias: 'root',
        type: 'string',
        requiresArg: true,
      },
      'record-domain': {
        alias: 'record',
        type: 'string',
        requiresArg: true,
      },
      port: {
        type: 'number',
        default: 8000,
      },
      'database-port': {
        alias: 'database',
        type: 'string',
        default: 3306,
      },
      'vpc-cidr': {
        alias: 'vpc',
        type: 'string',
        default: '10.0.0.0/16',
      },
      'instance-count': {
        alias: 'instance',
        type: 'number',
        default: 2,
      },
      'availability-zone': {
        alias: 'zone',
        type: 'string',
        default: 'ap-northeast-2a,ap-northeast-2b',
      },
      'min-capacity': {
        alias: 'min',
        type: 'number',
        default: 1,
      },
      'max-capacity': {
        alias: 'max',
        type: 'number',
        default: 2,
      },
      'instance-cpu': {
        alias: 'icpu',
        type: 'number',
        default: 1024,
      },
      'instance-memory': {
        alias: 'imem',
        type: 'number',
        default: 2048,
      },
      'container-cpu': {
        alias: 'ccpu',
        type: 'number',
        default: 512,
      },
      'container-memory': {
        alias: 'cmem',
        type: 'number',
        default: 1024,
      },
    }).argv;

    if (!options.service || !options.ecr) {
      console.log(`Please provide a service name and ecr name`);
      process.exit(1);
    }

    if (!options.rootDomain || !options.recordDomain) {
      console.log('Please provide root and record domain');
      process.exit(1);
    }

    return options;
  }

  if (argv.template === 's3-web') {
    const options = await yargs.usage(chalk.cyan('S3 Web Options')).options({
      template: {
        type: 'string',
        requiresArg: true,
      },
      profile: {
        type: 'string',
        default: 'default',
        requiresArg: true,
      },
      region: {
        type: 'string',
        default: 'ap-northeast-2',
      },
      bucket: {
        type: 'string',
        requiresArg: true,
      },
      'cloudfront-comment': {
        alias: 'comment',
        type: 'string',
      },
      'root-domain': {
        alias: 'root',
        type: 'string',
        requiresArg: true,
      },
      'record-domain': {
        alias: 'record',
        type: 'string',
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
      console.log('Please provide root and record domain');
      process.exit(1);
    }

    return options;
  }

  if (argv.template === 'ec2-alb') {
    const options: any = await yargs.usage(chalk.cyan('EC2 ALB Options')).options({
      name: {
        type: 'string',
        requiresArg: true,
      },
      keyName: {
        type: 'string',
        requiresArg: true,
      },
      region: {
        type: 'string',
        default: 'ap-northeast-2',
      },
      profile: {
        type: 'string',
        default: 'default',
      },
      rootDomain: {
        alias: 'root',
        type: 'string',
      },
      recordDomain: {
        alias: 'record',
        type: 'string',
      },
      ami: {
        type: 'string',
        default: 'ami-003bb1772f36a39a3',
      },
      vpcCidr: {
        alias: 'vpc',
        type: 'string',
      },
      instanceCount: {
        alias: 'instance',
        type: 'number',
        default: 1,
      },
      instanceType: {
        alias: 'type',
        type: 'string',
        default: 't2.micro',
      },
      availabilityZone: {
        alias: 'type',
        type: 'string',
        default: 'ap-northeast-2a,ap-northeast-2b',
      },
      originHttp: {
        alias: 'http',
        type: 'string',
        default: '',
      },
      originHttps: {
        alias: 'https',
        type: 'string',
        default: '',
      },
      redirectHttp: {
        type: 'string',
        default: '',
      },
    }).argv;

    if (!options.name || !options.keyName) {
      console.log(`Please provide a name and key name`);
      process.exit(1);
    }
    if (!options.rootDomain || !options.recordDomain) {
      console.log('Please provide root and record domain');
      process.exit(1);
    }
    if (!options.vpcCidr) {
      console.log('Please provide vpc cidr');
      process.exit(1);
    }
    console.log({
      http: options.http,
      https: options.https,
      redirectHttp: options.redirectHttp,
    });

    options.http = options.http?.split(',').map(parseInt).filter(Boolean);
    options.https = [443, ...options.https?.split(',').map(parseInt)].filter(Boolean);
    options.redirectHttp = [
      [80, 443],
      ...options?.redirectHttp
        .split(',')
        .map((value) => {
          if (value.includes('-')) {
            return value.split('-').map(Number);
          } else {
            return null;
          }
        })
        .filter(Boolean),
    ];
    options.ports = [
      ...options.http,
      ...options.https,
      ...options.redirectHttp.reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
      }, []),
    ].reduce((acc, curr) => {
      if (!acc.includes(curr)) acc.push(curr);
      return acc;
    }, []);

    // console.log(options);

    return options;
  }

  if (!argv.template) {
    console.log(`Please provide a template name`);
    process.exit(1);
  }
};

export default getOptions;
