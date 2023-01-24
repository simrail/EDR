import React, {Fragment, Suspense} from 'react';
import "./index.css"
import {Flowbite} from "flowbite-react/lib/esm/components/Flowbite";
import {Spinner} from "flowbite-react/lib/esm/components/Spinner";
import {useSoundNotification} from "./EDR/hooks/useSoundNotification";
import {BrowserRouter, Route, Routes} from "react-router-dom";
const ServerSelect = React.lazy(() => import("./SelectMenu/ServerSelect"));
const PostSelect = React.lazy(() => import("./SelectMenu/PostSelect"));
const EDR = React.lazy(() => import("./EDR"));

function App() {
    const [SoundNotification, playSoundNotification] = useSoundNotification();

    return <Flowbite>
        <SoundNotification />
        <div className="min-h-screen dark:bg-slate-800 text-black dark:text-white">
            <BrowserRouter>
                <Fragment>
                    <Suspense fallback={<Spinner />}>
                    <Routes>
                        <Route path="/" element={<ServerSelect />} />
                        <Route path="/:serverCode" element={<PostSelect />} />
                        <Route path="/:serverCode/station/:post" element={<EDR playSoundNotification={playSoundNotification} />} />
                    </Routes>
                    </Suspense>
                </Fragment>
            </BrowserRouter>
        </div>
    </Flowbite>
}

export default App;
