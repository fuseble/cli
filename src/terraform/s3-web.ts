import { flatten, unflatten } from 'flat';
import fsExtra from 'fs-extra';
import { S3_WEB_JSON } from '@/files';

const write = (argv) => {
  const flattenFile = flatten(S3_WEB_JSON) as Record<string, any>;
  for (const [key, value] of Object.entries(flattenFile)) {
    if (typeof value !== 'string' || !value.includes('<') || !value.includes('>')) continue;

    if (value.includes('<REGION>')) {
      flattenFile[key] = value.replace('<REGION>', argv.region);
    }
    if (value.includes('<PROFILE>')) {
      flattenFile[key] = argv.profile;
    }
    if (value.includes('<BUCKET_NAME>')) {
      flattenFile[key] = value.replace('<BUCKET_NAME>', argv.bucket);
    }
    if (value.includes('<CLOUDFRONT_COMMENT>')) {
      flattenFile[key] = argv.cloudfrontComment;
    }
    if (value.includes('<ROOT_DOMAIN>')) {
      flattenFile[key] = value.replace('<ROOT_DOMAIN>', argv.rootDomain);
    }
    if (value.includes('<RECORD_DOMAIN>')) {
      flattenFile[key] = value.replace('<RECORD_DOMAIN>', argv.recordDomain);
    }

    const newConfig = unflatten(flattenFile);

    fsExtra.writeJsonSync(`./variables.tfvars.json`, newConfig, {
      spaces: 2,
    });
  }
};

export default write;
