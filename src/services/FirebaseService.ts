import * as admin from 'firebase-admin';
import { Service } from "@tsed/common";
import * as parameters from '../../parameters.json';
import * as R from 'ramda';

@Service()
export class FirebaseService {

  /**
   * Initializes a new Firebase App client
   * @returns Firebase client
   */
  initializeFirebaseApp(): any {
    const emptyApps = R.not(admin.apps.length);

    if (emptyApps) {
      admin.initializeApp(
        {
          credential: admin.credential.cert({
            projectId: parameters.firebase.credentials.project_id,
            privateKey: parameters.firebase.credentials.private_key,
            clientEmail: parameters.firebase.credentials.client_email
          }),
          databaseURL: parameters.firebase.databaseURL
        },
        'Synchronizer'
      )
    }

    return admin.apps.pop()!.database();
  }

}