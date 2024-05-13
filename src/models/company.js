export class Company { 
    constructor(
        // id, // guid
        title, // company name
        subtitle, // optional tagline
        hqLocation, // variable, can be "City, USA", or "USA" or whatever 
        linkWebsite, // for all links - if null just dont show that element,
        linkXTwitter, // just show if content 
        linkInsta,
        linkFacebook,
        linkLinkedin,
        linkDiscord,
        linkTelegram,
        companyContent, // copy about the company, formatted text
        isActive // null and true mean active, false means not active (TODO: default dont select non actives to client)
    ) { 
        // this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.hqLocation = hqLocation;
        this.linkWebsite = linkWebsite;
        this.linkXTwitter = linkXTwitter;
        this.linkInsta = linkInsta;
        this.linkFacebook = linkFacebook;
        this.linkLinkedin = linkLinkedin;
        this.linkDiscord = linkDiscord;
        this.linkTelegram = linkTelegram;
        this.companyContent = companyContent;
        this.isActive = isActive;
    }
}
