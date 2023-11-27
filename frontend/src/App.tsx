import React, {Fragment, Suspense} from 'react';
import "./index.css"
import {Flowbite} from "flowbite-react/lib/esm/components/Flowbite";
import {Spinner} from "flowbite-react/lib/esm/components/Spinner";
import {useSoundNotification} from "./EDR/hooks/useSoundNotification";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { SupportsWebp } from './EDR/functions/webp';
import ServerSelect from './SelectMenu/ServerSelect';
import { useDarkMode } from "usehooks-ts";
import { useTranslation } from 'react-i18next';
const TrainSelect = React.lazy(() => import("./SelectMenu/TrainSelect"));
const Sirius = React.lazy(() => import("./Sirius"));
const PostSelect = React.lazy(() => import("./SelectMenu/PostSelect"));
const EDR = React.lazy(() => import("./EDR"));

function App() {
    const [SoundNotification, playSoundNotification] = useSoundNotification();
    let [isWebpSupported, setIsWebpSupported] = React.useState(false);
    const { t } = useTranslation();
    const { isDarkMode } = useDarkMode();
    React.useEffect(() => {
        SupportsWebp().then(result => setIsWebpSupported(result));
    }, [isWebpSupported]);

    return <SnackbarProvider autoHideDuration={3000} maxSnack={3}>
        <Flowbite theme={{ dark: isDarkMode }}>
            <SoundNotification />
            <div className="min-h-screen dark:bg-slate-800 text-black dark:text-white">
                <BrowserRouter>
                    <Fragment>
                        <Suspense fallback={<div className="flex items-center justify-around w-full"><div><Spinner /> {t("APP_loading")}</div></div>}>
                        <Routes>
                            <Route path="/" element={<ServerSelect isWebpSupported={isWebpSupported} />} />
                            <Route path="/:serverCode" element={<PostSelect isWebpSupported={isWebpSupported}/>} />
                            <Route path="/:serverCode/trains" element={<TrainSelect/>} />
                            <Route path="/:serverCode/station/:post" element={<EDR playSoundNotification={playSoundNotification} isWebpSupported={isWebpSupported}/>} />
                            <Route path="/:serverCode/train/:trainNumber" element={<Sirius isWebpSupported={isWebpSupported}/>} />
                        </Routes>
                        </Suspense>
                    </Fragment>
                </BrowserRouter>
            </div>
        </Flowbite>
    </SnackbarProvider>
}

export default App;
