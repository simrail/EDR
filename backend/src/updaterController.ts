import express, {response} from "express";
import axios from "axios";

interface release_response_interface {
    version: string;
    notes: string;
    pub_date: string;
    url: string | any;
    signature: string | any;
}

let platforms =
   [
        {
            "name"  :"linux-x86_64",
            "extensions" :"amd64.AppImage.tar.gz"
        },
       {
           "name"  :"darwin-x86_64",
           "extensions" :"app.tar.gz"
        },
       {
           "name"  :"darwin-aarch64",
           "extensions" :"app.tar.gz"
       },
       {
           "name"  :"windows-x86_64",
           "extensions" :"x64_en-US.msi.zip"
       }
    ]
export async function checkupdate(req: express.Request, res: express.Response) {
    const repo = process.env.REPO_EDR_DESKTOP
    const platform = req.params.platform
    const version = req.params.current_version
    let release = await getlatestrelease(repo, platform, version)
    res.send(release)
}

async function getlatestrelease(repo: string | undefined ,os:string ,version :string): Promise<release_response_interface | any> {
    const github_latest_release_url = `https://api.github.com/repos/${repo}/releases/latest`
    try {
        return axios({ //you need to return in your saveFormData scope also
            method: 'get',
            url: github_latest_release_url,
        })
            .catch((error) => {
                console.log(error);
                return error
            })
            .then((response) => {
                let release = response.data
                let release_response: release_response_interface = {
                    version:release.tag_name,
                    notes:release.body,
                    pub_date:release.published_at,
                    url:null,
                    signature:null
                }
                release.assets.forEach(async (asset:any) => {
                    platforms.forEach((platform ) => {
                        if (asset.name.endsWith(platform.extensions ) && platform.name == os){
                            release_response.url = asset.browser_download_url
                        }
                    });
                });

                if ( !release_response.url) {
                    response.sendStatus(204);
                }else {
                    let latest_version = release_response.version.split('v')
                    let current_version = version.split('v')
                    if (latest_version > current_version){
                        return release_response
                    }else{
                        response.sendStatus(204);
                    }
                    return release_response
                }
            });
    } catch (e) {
        return response.sendStatus(204);
    }
}


