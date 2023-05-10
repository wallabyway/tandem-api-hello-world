const av = Autodesk.Viewing;

// initialize Tandem Viewer and load different facilities
class tandemViewer {

    constructor(div) {
    return new Promise(resolve=>{

        const options = {
            env: "DtProduction",
            api: 'dt',
            productId: 'Digital Twins',
            corsWorker: true,
        };
        av.Initializer(options, () => {
            this.viewer = new av.GuiViewer3D(div, {
                extensions: ['Autodesk.BoxSelection'],
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
        [1143, 1144, 1145, 1146].map(dbid =>{
            const randomColor = new THREE.Vector4(Math.random(),0,Math.random(),1);
            viewer.setThemingColor(dbid,randomColor,viewer.getAllModels()[1])
        });
    }

    $("test-viz").onclick = () => {
        [52, 730, 762, 3553].map(dbid =>{
            const callfn = (Math.random() > 0.5) ? viewer.impl.visibilityManager.hide : viewer.impl.visibilityManager.show
            callfn(dbid, viewer.getAllModels()[0])
        })
    };
}
main();


