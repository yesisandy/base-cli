
import {input, select} from '@inquirer/prompts'
import {clone} from './clone'
import path from 'path'
import fs from 'fs-extra'
import {name,version} from '../../package.json'
import chalk from 'chalk'
export interface TemeplateInfo {
    name: string,
    downLoadUrl: string,
    description: string,
    branch: string
}

export const templates:Map<string, TemeplateInfo> = new Map([
    ['vue3', {
        name: 'geeker-vue3.3-admin',
        downLoadUrl: 'https://gitee.com/codeboy-wl/geeker-vue-admin.git',
        description: 'vue3技术栈开发模板',
        branch: 'master'
    }],
    ['react18', {
        name: 'react18-manager',
        downLoadUrl: 'https://gitee.com/codeboy-wl/react18-manager.git',
        description: 'react技术栈开发模板',
        branch: 'master'
    }],
    ['取消', {
        name: '',
        downLoadUrl: '',
        description: '',
        branch: ''
    }]
])

function overwriteFile(filePath: string) {
    return select({
        message: '检测到同级目录下存在同名项目，是否覆盖？',
        choices: [
           {
            name: '覆盖',
            value: true
           },
           {
            name: '取消',
            value: false
           }
        ]
    })
}

async function checkVersion(name:string,version:string) {
   let  lastestVersion = {}
   try{
        let res =await (await fetch('https://registry.npmjs.org/-/package/'+name+'/dist-tags')).json()
        lastestVersion = JSON.parse(JSON.stringify(res)).latest
   }catch(error){
        console.error(error)
   }
    if(lastestVersion !== version && lastestVersion){
        console.warn(`检测到有新版本v${lastestVersion},当前版本是v${version}，下载最新模板请使用 ${chalk.green('zaizhen-cli update')} 命令`)
    }
}

export async function create(projectName?: string) {
    if(!projectName){
        projectName = await input({
            message: '请输入项目名称'
        })
    }

    //如果文件夹存在，则提示覆盖现有的文件夹；
    const filePath = path.resolve(process.cwd(),projectName);
    if(fs.existsSync(filePath)){
        const option = await overwriteFile(filePath)
        if(!option) return
        await fs.remove(filePath) //删除文件夹
    }

    //初始化模板列表
    const templateList = Array.from(templates).map((item)=>{
        const [name, info] = item
        return {
            name,
            value: name,
            description: info.description
        }
    })

    //校验版本号，在选择模板前，避免本地和线上的模板不一样；
    await checkVersion(name,version)
    
    const templateName = await select({
        message: '请选择模板',
        choices: templateList
    })
    const info = templates.get(templateName)
    if(!info!.name) return
    await clone(info!.downLoadUrl,projectName,['-b',info!.branch])
    
}