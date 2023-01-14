import getOptions from './options';
import writeECSFargate from './ecs-fargate';
import writeS3WEB from './s3-web';
import writeEC2ALB from './ec2-alb';

export default class TerraformCLI {
  public static init = async () => {
    const options = await getOptions();

    if (options.template === 'ecs-fargate') {
      writeECSFargate(options);
    } else if (options.template === 's3-web') {
      writeS3WEB(options);
    } else if (options.template === 'ec2-alb') {
      writeEC2ALB(options);
    }
  };
}
