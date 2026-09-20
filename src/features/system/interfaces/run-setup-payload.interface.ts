export interface RunSetupPayload {
  Giftistry: {
    Setup: {
      DbType: 'local' | 'remote';
      DbUrl?: string;
      SetupToken?: string;
      Admin: {
        Username: string;
        Password: string;
        FirstName: string;
        LastName: string;
      };
    };
  };
}
