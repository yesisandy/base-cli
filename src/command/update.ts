import process from 'child_process'
import chalk from 'chalk'
import ora from 'ora'

const spinner = ora({
    text:'zaizhen-cli正在更新中...',
    spinner:{
        interval:300,
        frames:['-','+','-'].map((item)=>{
            return chalk.green(item)
        })
    }
})

export function update(){
    spinner.start()
    process.exec('pnpm i -g zaizhen-cli@latest', (error)=>{
        spinner.stop()
        if(!error){
            console.log(chalk.green('更新成功'))
        }else{
            console.log(chalk.red('更新失败'))
        }
    })
}