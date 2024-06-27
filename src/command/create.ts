
import {input, select} from '@inquirer/prompts'
import {clone} from './clone'
import path from 'path'
import fs from 'fs-extra'
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
    
    const templateName = await select({
        message: '请选择模板',
        choices: templateList
    })
    const info = templates.get(templateName)
    if(info){
        await clone(info.downLoadUrl,projectName,['-b',info.branch])
    }
}