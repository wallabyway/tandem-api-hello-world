const av = Autodesk.Viewing;
// for local development, using the local python3 server.py
//const token_URL = "/token";

// for deployment, use an AWS lambda function, change line 3, to this... 
const token_URL = "https://f2iv2mhpbebrhrkfsnn2lvloxq0janqb.lambda-url.us-west-2.on.aws";

// initialize Tandem Viewer and load different facilities
class tandemViewer {

    constructor(div) {
    return new Promise(async (resolve) => {

        const options = {
            env: "DtProduction",
            api: 'dt',
            productId: 'Digital Twins',
            corsWorker: true,
        };
        //pull token from server hosted at http://localhost/token
        const _access_token = await (await fetch(token_URL)).text();

        av.Initializer(options, () => {
            this.viewer = new av.GuiViewer3D(div, {
                extensions: ['Autodesk.BoxSelection',/*"GeoThreeExtension"*/],
                screenModeDelegate: av.NullScreenModeDelegate,
                theme: 'light-theme',
            });
            this.viewer.start();
            av.endpoint.HTTP_REQUEST_HEADERS['Authorization'] = `Bearer ${_access_token}`;
            this.app = new av.Private.DtApp({});
            window.DT_APP = this.app;
            resolve(this);
        });
    })}

    async fetchFacilities(URN) {
        const FacilitiesSharedWithMe = await this.app.getCurrentTeamsFacilities();
        const myFacilities = await this.app.getUsersFacilities();
        return [].concat(FacilitiesSharedWithMe, myFacilities);
    }

    async openFacility(facility) {
        this.app.displayFacility(facility, false, this.viewer);
    }      
}

// This example shows 3 things:
//  1. How to Load a Model from Tandem (defaults to the 1st Facility)
//  2. Changing colors of elements randomly
//  3. Hiding and Showing elements (visibility)
async function main() {
    const $ = (id) => {return document.getElementById(id)};

    const tandem = await new tandemViewer($("viewer"));
    window.viewer = tandem.viewer;

    // open the first drawing
    const allFacilities = await tandem.fetchFacilities();
    await tandem.openFacility(allFacilities[1]);

    $("test-colors").onclick = () => {
        [3, 7, 12, 13, 18, 22, 23].map(dbid =>{
            const randomColor = new THREE.Vector4(Math.random(),0,Math.random(),1);
            viewer.setThemingColor(dbid,randomColor,viewer.getAllModels()[4])
        });
    }

    $("test-viz").onclick = () => {
        [3, 7, 12, 13, 18, 22, 23].map(dbid =>{
            const callfn = (Math.random() > 0.5) ? viewer.impl.visibilityManager.hide : viewer.impl.visibilityManager.show
            callfn(dbid, viewer.getAllModels()[4])
        })
    };
}
main();


