import simpleGit,{SimpleGitOptions} from 'simple-git';
import chalk from 'chalk'
import createLogger from 'progress-estimator'

//初始化进度条
const logger = createLogger({
    spinner:{
        interval: 120,
        frames:['-','+','-'].map((item)=>{
            return chalk.green(item)
        })
    }
})

const gitOptions:Partial<SimpleGitOptions>={
    baseDir: process.cwd(),//当前的工作目录；
    binary: 'git',
    maxConcurrentProcesses: 6
}


export const clone = async (url:string, projectName:string,option:string[]) => {
    const git = simpleGit(gitOptions)
    try{
        await logger(git.clone(url,projectName,option),'代码下载中...',{
           estimate:7000 //预估时间
        })
        console.log(chalk.green('下载成功,请先使用pnpm 安装依赖'))
    }catch(error){
        console.log(chalk.red('下载失败，请重新尝试下载'))
        console.log(error)
    }
}