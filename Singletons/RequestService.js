class RequestService {

    static instance;
    static getInstance(){
        if(RequestService.instance)
        {
            return RequestService.instance;
        }
        else {RequestService.instance = new RequestService();}
        return RequestService.instance;
    }


    constructor() {
        this.currentSystem = null;
    }

    setCurrentSystem(system)
    {
        this.currentSystem = system;
    }

    getCurrentSystem()
    {
        return this.currentSystem;
    }

}

module.exports = RequestService;