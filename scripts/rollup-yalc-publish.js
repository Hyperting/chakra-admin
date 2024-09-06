const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function checkYalcInstallation() {
  try {
    const { stdout } = await exec('yalc --version')

    if (stdout.includes('1.0.0')) {
      return true
    }

    return false
  } catch (err) {
    console.error(err)
    return false
  }
}

async function yalcPush() {
  try {
    const { stdout, stderr } = await exec('yalc push')

    if (stderr) {
      console.error('Error: yalc push failed:')
      console.error(stderr)
    }

    console.log(stdout)
    if (stdout) {
      console.log('🎉 yalc push succeeded!')
    }
  } catch (err) {
    console.error(err)
    return false
  }
}

export const yalcPublish = (options = {}) => {
  const {} = options
  return {
    name: 'yalc-publish',
    writeBundle: async (options, bundle) => {
      // if (error) {
      //   return console.warn('🚨🚨 Warning: skipping YALC publish due to build error! 🚨🚨')
      // }

      const isYalcInstalled = await checkYalcInstallation()
      if (!isYalcInstalled) {
        console.error('🚨🚨 Error: skipping YALC publish due to missing YALC installation! 🚨🚨')
        return
      }

      return yalcPush()
    },
  }
}
