export type UserDetails = {
    email:    string;
    nickname: string;
    login?:   string;
    avatarURL: string;
    // Add any additional fields that are required by your Prisma schema
};

export interface GoogleUserDetails extends UserDetails {
  email:    string;
  nickname: string;
  avatarURL: string;
}

export interface FortyTwoUserDetails extends UserDetails {
  login:    string;
  avatarURL: string;

}