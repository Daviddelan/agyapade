import express from 'express';
//import { connect } from '../fabric/connect';
import { connect } from 'src/server/fabric/connect';
import { Contract } from 'fabric-network';

const app = express();
app.use(express.json());

let contract: Contract | null = null;

// Initialize Fabric connection
(async () => {
  try {
    contract = await connect();
    console.log('Connected to Fabric network');
  } catch (error) {
    console.error('Failed to connect to Fabric network:', error);
  }
})();

// Verify document endpoint
app.post('/api/verify-document', async (req, res) => {
  try {
    if (!contract) {
      throw new Error('Fabric network connection not initialized');
    }

    const { docId, docHash, verifiedBy, timestamp, comments } = req.body;

    // Submit transaction to chaincode
    const result = await contract.submitTransaction(
      'verifyDocument',
      docId,
      docHash,
      verifiedBy,
      timestamp.toString(),
      comments || ''
    );

    const verification = JSON.parse(result.toString());
    res.json({
      ...verification,
      transactionId: result.getTransactionId(),
    });
  } catch (error) {
    console.error('Error verifying document:', error);
    res.status(500).json({ error: 'Failed to verify document' });
  }
});

// Get document status endpoint
app.get('/api/document-status/:docId', async (req, res) => {
  try {
    if (!contract) {
      throw new Error('Fabric network connection not initialized');
    }

    const { docId } = req.params;
    const result = await contract.evaluateTransaction('getDocumentStatus', docId);
    res.json(JSON.parse(result.toString()));
  } catch (error) {
    console.error('Error getting document status:', error);
    res.status(500).json({ error: 'Failed to get document status' });
  }
});

// Get verification history endpoint
app.get('/api/verification-history/:docId', async (req, res) => {
  try {
    if (!contract) {
      throw new Error('Fabric network connection not initialized');
    }

    const { docId } = req.params;
    const result = await contract.evaluateTransaction('getVerificationHistory', docId);
    res.json(JSON.parse(result.toString()));
  } catch (error) {
    console.error('Error getting verification history:', error);
    res.status(500).json({ error: 'Failed to get verification history' });
  }
});

export default app;