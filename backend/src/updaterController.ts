import express, {response} from "express";
import axios from "axios";

interface release_response_interface {
    version: string;
    notes: string;
   // pub_date: string;
    url: string | any;
    signature: string ;

    error: string | any
}

let platforms =
   [
        {
            "name"  :"linux",
            "extensions" :"amd64.AppImage.tar.gz"
        },
       {
           "name"  :"darwin",
           "extensions" :"app.tar.gz"
        },
       {
           "name"  :"windows",
           "extensions" :"x64_en-US.msi.zip"
       }
    ]
export async function checkupdate(req: express.Request, res: express.Response) {
    const repo = process.env.REPO_EDR_DESKTOP
    const platform = req.params.platform
    const version = req.params.current_version
    let release = await getlatestrelease(repo, platform, version)
    if (release.error){
        res.status(204)
    }
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
            .then(async (response) => {
                let release = response.data
                let release_response: release_response_interface = {
                    version: release.tag_name,
                    notes: release.body,
                    //  pub_date:release.published_at,
                    url: null,
                    signature: "",
                    error: null
                }
                 for (const asset of release.assets) {
                    for (const platform of platforms) {
                        if (asset.name.endsWith(platform.extensions) && platform.name == os) {
                            release_response.url = asset.browser_download_url
                        } else if (asset.name.endsWith(`${platform.extensions}.sig`) && platform.name == os) {
                            response = await axios.get(asset.browser_download_url)
                            release_response.signature = response.data
                        }
                    }
                }
                if (!release_response.url) {
                    release_response.error = "version not found"
                    return release_response;
                } else {
                    let latest_version = release_response.version.split('v')
                    if (latest_version[1] > version) {

                        release_response.version = latest_version[1]
                        return release_response
                    } else {
                        release_response.error = "version updated"
                        return release_response;
                    }
                }
            });
    } catch (e) {
        return response.sendStatus(204);
    }
}


