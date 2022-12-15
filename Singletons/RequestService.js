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
    }

    setCurrentUser(user)
    {
        this.currentUser = user;
    }

    getcurrentUser()
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