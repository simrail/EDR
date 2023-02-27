import React, {Fragment, Suspense} from 'react';
import "./index.css"
import {Flowbite} from "flowbite-react/lib/esm/components/Flowbite";
import {Spinner} from "flowbite-react/lib/esm/components/Spinner";
import {useSoundNotification} from "./EDR/hooks/useSoundNotification";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { SupportsWebp } from './EDR/functions/webp';
import {TrainSelect} from "./SelectMenu/TrainSelect";
const Sirius = React.lazy(() => import("./Sirius"));
const ServerSelect = React.lazy(() => import("./SelectMenu/ServerSelect"));
const PostSelect = React.lazy(() => import("./SelectMenu/PostSelect"));
const EDR = React.lazy(() => import("./EDR"));

// TODO: Add a graph view of the regulator table https://images-ext-1.discordapp.net/external/7o6s9Hg5wVE41mRwSFfsX5D7erzJCfIx9I4CnhAZM-4/https/maligne-e-t4.transilien.com/wp-content/uploads/2017/01/20170110_153237.jpg?width=717&height=403
// TODO: With the three previous and three next posts. Try to adjust with the instantaneous delay if possible
// TODO: And after beta add expected delay
function App() {
    const [SoundNotification, playSoundNotification] = useSoundNotification();
    let [isWebpSupported, setIsWebpSupported] = React.useState(false);
    React.useEffect(() => {
        SupportsWebp().then(result => setIsWebpSupported(result));
    }, [isWebpSupported]);

    return <SnackbarProvider autoHideDuration={3000} maxSnack={3}>
        <Flowbite>
            <SoundNotification />
            <div className="min-h-screen dark:bg-slate-800 text-black dark:text-white">
                <BrowserRouter>
                    <Fragment>
                        <Suspense fallback={<div className="flex items-center justify-around w-full"><div><Spinner /> Loading javascript chunk</div></div>}>
                        <Routes>
                            <Route path="/" element={<ServerSelect isWebpSupported={isWebpSupported} />} />
                            <Route path="/:serverCode" element={<PostSelect isWebpSupported={isWebpSupported}/>} />
                            <Route path="/:serverCode/trains" element={<TrainSelect/>} />
                            <Route path="/:serverCode/station/:post" element={<EDR playSoundNotification={playSoundNotification} isWebpSupported={isWebpSupported}/>} />
                            <Route path="/:serverCode/train/:trainNumber" element={<Sirius />} />
                        </Routes>
                        </Suspense>
                    </Fragment>
                </BrowserRouter>
            </div>
        </Flowbite>
    </SnackbarProvider>
}

export default App;
