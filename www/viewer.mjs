import { initLMV, startViewer } from './lmv.js';

const dm = (id) => {return document.getElementById(id)};
const hide = (id) => { return dm.style.display = "none" };

async function main() {
    await initLMV();
    console.log('LMV is up and running');

    // init viewer
    const container = document.getElementById('viewer');
    const viewer = startViewer(container);
    console.log('Viewer started');

    window.sessionStorage.token = (await (await fetch("/oauth/token")).json()).access_token;
    if (window.sessionStorage.token) // hide login button, show profile instead        
        dm("autodeskSigninButton").innerText = "logout";

    // init app
    const app = new Autodesk.Viewing.Private.DtApp({});
    window.DT_APP = app;
    // fetch facilities (and sort by urn)
    const facilities = await app.getCurrentTeamsFacilities();

    
    // fetch facilities (and sort by urn)
    //const facilities = await app.getFacilities();
    //facilities.sort((a,b)=>a.urn().localeCompare(b.urn()));

    if(facilities.length == 0) {
        Autodesk.Viewing.Private.AlertBox.displayError(
            viewer.container,
            'Make sure you are have access to at least one facility in Autodesk Tandem.',
            'No facilities found',
            'img-item-not-found'
        );
        return;
    }
    app.displayFacility(facilities[0], false, viewer);

}

main();
