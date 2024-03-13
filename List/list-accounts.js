const Account = require("../Models/account");
const RequestService = require("../Singletons/RequestService");

const listingRules = require("./listing-rules");

async function listAccounts(req, res, next) {
    const rules = listingRules;
    const perPage = rules.perPage;

    const page = req?.query?.page;
    const reqService = RequestService.getInstance();

    const account = reqService.getCurrentAccount();
    const user = reqService.getCurrentUser();
    const system = reqService.getCurrentSystem();

    const offset = (page - 1) * perPage;

    

    if(account.role === 'root')
    {
        await Account.findAndCountAll({limit: perPage, offset: offset}).then((result) => {
            res.json({
                event: "OK",
                response: result
            });
            return;
        }).catch((err) => {
            res.json({
                event: "error", 
                code: "Fatal Error", 
                message: "Something went wrong while trying to list your accounts",
                error: err
            });
            return;
        })
    }

    if(account.role === 'admin')
    {
        await Account.findAndCountAll({limit: perPage, offset: offset, where: {systemId: account.systemId}}).then((result) => {
            res.json({
                event: "OK",
                response: result
            });
            return;
        }).catch((err) => {
            res.json({
                event: "error", 
                code: "Fatal Error", 
                message: "Something went wrong while trying to list your accounts",
                error: err
            });
            return;
        })
        res.json({
            account: account,
            user: user,
            system: system
        });
        return;
    }
}

module.exports = listAccounts;