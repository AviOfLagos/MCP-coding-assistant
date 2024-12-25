import { addDocumentationHandler } from '../src/handlers/addDocumentationHandler.js';
import problemMonitor from '../src/utils/problemMonitor.js';

async function testAddDocumentation() {
  const issueId = 'add_documentation';

  // First attempt with invalid arguments to cause failure
  try {
    await addDocumentationHandler({
      method: 'tools/call',
      params: {
        name: 'add_documentation',
        arguments: {
          urls: null, // Invalid argument
        },
      },
    });
  } catch (error) {
    console.log('First attempt failed as expected.');
  }

  // Second attempt with invalid arguments to cause failure
  try {
    await addDocumentationHandler({
      method: 'tools/call',
      params: {
        name: 'add_documentation',
        arguments: {
          urls: null, // Invalid argument
        },
      },
    });
  } catch (error) {
    console.log('Second attempt failed as expected.');
  }

  // Third attempt should trigger the problem monitor
  try {
    await addDocumentationHandler({
      method: 'tools/call',
      params: {
        name: 'add_documentation',
        arguments: {
          urls: null, // Invalid argument
        },
      },
    });
  } catch (error) {
    console.log('Third attempt failed, problem monitor should disable auto-approval.');
  }

  // Check if auto-approval is disabled
  const autoApproveStatus = problemMonitor.shouldAutoApprove();
  console.log(`Auto-approval status: ${autoApproveStatus ? 'Enabled' : 'Disabled'}`);

  // Print the AI coder's response
  const aiResponse = problemMonitor.getAICoderResponseForIssue(issueId);
  console.log(`AI coder's response: ${aiResponse}`);

  // Check action_log.txt content
  console.log('Please check action_log.txt to see the logged actions.');
}

testAddDocumentation();
