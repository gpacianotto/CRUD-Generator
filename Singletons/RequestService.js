const System = require('../Models/systems');

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
        this.currentUser = null;
        this.currentAccount = null;
        this.currentSession = null;

        /*
            state = 0 <- não se sabe
            state = 1 <- existe
            state = 2 <- não existe
        */

        this.systemRootExists = {
            state: 0
        }
    }

    async verifyIfSystemRootExists() {
        let response;
        let flagError;

        await System.findAll({where: {name: "root"}}).then((result) => {
            if(result.length === 1)
            {
                response = 1;
            }

            else {
                response = 2
            }
        }).catch((err) => {
            response = 0;
            flagError = true;
        })

        return response
    }

    doesSystemRootExists() {
        return this.systemRootExists.state;
    }

    setSystemRootExists(state) {
        this.systemRootExists.state = state;
    }

    setCurrentUser(user)
    {
        this.currentUser = user;
    }

    getCurrentUser()
    {
        return this.currentUser;
    }

    setCurrentAccount(account)
    {
        this.currentAccount = account
    }

    getCurrentAccount()
    {
        return this.currentAccount;
    }

    setCurrentSession(session)
    {
        this.currentSession = session;
    }

    getCurrentSession()
    {
        return this.currentSession;
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