const { SSMClient, GetParametersByPathCommand } = require('@aws-sdk/client-ssm');

let params = null;

async function getSSMParametersByPath(region, path) {
  const ssmClient = new SSMClient({ region: region });

  const reqParams = {
    Path: path,
    Recursive: true,
    WithDecryption: true,
  };

  try {
    const command = new GetParametersByPathCommand(reqParams);
    const data = await ssmClient.send(command);

    if (data.Parameters) {
      let res = {};
      data.Parameters.forEach((el) => (res[el.Name.match(/[^\/]+$/)] = el.Value));
      return res;
    } else {
      throw new Error('No ssm parameters found at the specified path.');
    }
  } catch (err) {
    console.error('Error retrieving ssm parameters by path:', err);
    throw err;
  }
}

exports.get = async function () {
  if (params) return params;
  params = await getSSMParametersByPath('eu-west-1', '/video-player/');
};
