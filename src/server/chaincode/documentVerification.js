'use strict';

const { Contract } = require('fabric-contract-api');

class DocumentVerificationContract extends Contract {
  async initLedger(ctx) {
    console.info('Initialized document verification ledger');
  }

  async verifyDocument(ctx, docId, docHash, verifiedBy, timestamp, comments = '') {
    const verification = {
      docId,
      docHash,
      verifiedBy,
      timestamp: parseInt(timestamp),
      comments,
      status: 'VERIFIED',
    };

    await ctx.stub.putState(docId, Buffer.from(JSON.stringify(verification)));

    // Emit an event for the verification
    await ctx.stub.setEvent('DocumentVerified', Buffer.from(JSON.stringify(verification)));

    return verification;
  }

  async getDocumentStatus(ctx, docId) {
    const verificationBytes = await ctx.stub.getState(docId);
    if (!verificationBytes || verificationBytes.length === 0) {
      throw new Error(`Document ${docId} has not been verified`);
    }
    return JSON.parse(verificationBytes.toString());
  }

  async getVerificationHistory(ctx, docId) {
    const iterator = await ctx.stub.getHistoryForKey(docId);
    const history = [];
    
    while (true) {
      const result = await iterator.next();
      if (result.done) {
        await iterator.close();
        return history;
      }
      
      const verification = JSON.parse(result.value.value.toString('utf8'));
      history.push({
        txId: result.value.txId,
        timestamp: result.value.timestamp,
        verification,
      });
    }
  }
}

module.exports = DocumentVerificationContract;