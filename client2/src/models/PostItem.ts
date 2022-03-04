export interface PostItem {
  _id: string;
  title: string;
  body: string;
  createdDate: Date;
  author: {
    username: string;
    avatar: string;
  };
  isVisitorOwner: boolean;
}
