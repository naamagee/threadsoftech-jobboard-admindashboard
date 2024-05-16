export class Company { 
    constructor(
        // id
        title,
        subtitle,
        companyLogoId = null,
        hqLocation,
        linkWebsite,
        linkXTwitter,
        linkTikTok,
        linkInsta,
        linkFacebook,
        linkLinkedin,
        linkDiscord,
        linkTelegram,
        companyContent,
        // isActive = true
    ) { 
        // this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.companyLogoId = companyLogoId;
        this.hqLocation = hqLocation;
        this.linkWebsite = linkWebsite;
        this.linkXTwitter = linkXTwitter;
        this.linkTikTok = linkTikTok;
        this.linkInsta = linkInsta;
        this.linkFacebook = linkFacebook;
        this.linkLinkedin = linkLinkedin;
        this.linkDiscord = linkDiscord;
        this.linkTelegram = linkTelegram;
        this.companyContent = companyContent;
        // this.isActive = isActive;
    }
}
