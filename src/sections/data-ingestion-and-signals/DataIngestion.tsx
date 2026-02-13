import data from '@/../product/sections/data-ingestion-and-signals/data.json'
import { DataIngestion } from './components/DataIngestion'

export default function DataIngestionPreview() {
  return (
    <DataIngestion
      integrations={data.integrations as Parameters<typeof DataIngestion>[0]['integrations']}
      ingestionHealth={data.ingestionHealth as Parameters<typeof DataIngestion>[0]['ingestionHealth']}
      surveyCampaigns={data.surveyCampaigns as Parameters<typeof DataIngestion>[0]['surveyCampaigns']}
      recentSurveyResponses={data.recentSurveyResponses as Parameters<typeof DataIngestion>[0]['recentSurveyResponses']}
      signalActivity={data.signalActivity as Parameters<typeof DataIngestion>[0]['signalActivity']}
      engineers={data.engineers as Parameters<typeof DataIngestion>[0]['engineers']}
      onConnectIntegration={(type) => console.log('Connect integration:', type)}
      onDisconnectIntegration={(id) => console.log('Disconnect integration:', id)}
      onSyncIntegration={(id) => console.log('Sync integration:', id)}
      onCreateSurvey={() => console.log('Create survey')}
      onSendSurvey={(id) => console.log('Send survey:', id)}
      onSubmitCheckIn={(data) => console.log('Submit check-in:', data)}
    />
  )
}
