import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ICrudOperationProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context:WebPartContext;
  siteurl:string;
}
