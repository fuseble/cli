import { flatten, unflatten } from 'flat';
import fsExtra from 'fs-extra';
import { EC2_ALB_JSON } from '@/files';

const write = (argv: any) => {
  const flattenFile = flatten(EC2_ALB_JSON) as Record<string, any>;
  for (const [key, value] of Object.entries(flattenFile)) {
    if (typeof value !== 'string' || !value.includes('<') || !value.includes('>')) continue;

    if (value.includes('<NAME>')) {
      flattenFile[key] = value.replace('<NAME>', argv.name);
    }
    if (value.includes('<KEY_NAME>')) {
      flattenFile[key] = argv.keyName;
    }
    if (value.includes('<INSTANCE_TYPE>')) {
      flattenFile[key] = argv.instanceType;
    }
    if (value.includes('<INSTANCE_COUNT>')) {
      flattenFile[key] = argv.instanceCount;
    }
    if (value.includes('<REGION>')) {
      flattenFile[key] = argv.region;
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
    if (value.includes('<AVAILABILITY_ZONE>')) {
      flattenFile[key] = argv.availabilityZone.split(',');
    }
    if (value.includes('<AMI>')) {
      flattenFile[key] = argv.ami;
    }
    if (value.includes('<HTTP>')) {
      flattenFile[key] = argv.http;
    }
    if (value.includes('<HTTPS>')) {
      flattenFile[key] = argv.https;
    }
    if (value.includes('<REDIRECT_HTTP>')) {
      flattenFile[key] = argv.redirectHttp;
    }
    if (value.includes('<PORTS>')) {
      flattenFile[key] = argv.ports;
    }
  }

  const newConfig = unflatten(flattenFile);

  fsExtra.writeJsonSync('./variables.tfvars.json', newConfig, {
    spaces: 2,
    encoding: 'utf8',
  });
};

export default write;
