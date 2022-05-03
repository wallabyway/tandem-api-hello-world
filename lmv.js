
const av = Autodesk.Viewing;
const avp = av.Private;


export function initLMV() {
    return new Promise(resolve=>{
    Autodesk.Viewing.Initializer({
        env: "DtProduction",
        api: 'dt',
        useCookie: false,
        useCredentials: true,
        shouldInitializeAuth: false,
        opt_out_tracking_by_default: true,
        productId: 'Digital Twins',
        corsWorker: true,

        config3d: {
          extensions: ['Autodesk.BoxSelection'],
          screenModeDelegate: av.NullScreenModeDelegate,
        },
      }, function () {
        avp.logger.setLevel(5);
        resolve();
      });
    });
}

export function startViewer(viewerElement) {
    const viewer = new av.GuiViewer3D(viewerElement, {
        extensions: ['Autodesk.BoxSelection'],
        screenModeDelegate: av.NullScreenModeDelegate,
        theme: 'light-theme',
      });

    viewer.start();
    window.viewer = viewer;
    return viewer;
}

export async function openFacility(URN) {

    Autodesk.Viewing.endpoint.HTTP_REQUEST_HEADERS['Authorization'] = 'Bearer ' + window.sessionStorage.token;

    const app = new Autodesk.Viewing.Private.DtApp({});
    window.DT_APP = app;
    const facilities = await app.getCurrentTeamsFacilities();
    //const facilities = await app.getUsersFacilities();
    app.displayFacility(facilities[1], false, window.viewer);
}
