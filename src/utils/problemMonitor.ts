import fs from 'fs';
import path from 'path';

class ProblemMonitor {
  private attemptCounts: Map<string, number> = new Map();
  private autoApprove: boolean = true;
  private issueResponses: Map<string, string> = new Map();

  // Record an attempt for a specific issue
  recordAttempt(issueId: string): void {
    const attempts = this.attemptCounts.get(issueId) || 0;
    this.attemptCounts.set(issueId, attempts + 1);
  }

  // Check if the attempt threshold has been reached
  isThresholdReached(issueId: string, threshold: number = 2): boolean {
    const attempts = this.attemptCounts.get(issueId) || 0;
    return attempts >= threshold;
  }

  // Get the number of attempts for a specific issue
  getAttemptCount(issueId: string): number {
    return this.attemptCounts.get(issueId) || 0;
  }

  // Reset attempts for a specific issue
  resetAttempts(issueId: string): void {
    this.attemptCounts.delete(issueId);
    this.issueResponses.delete(issueId);
  }

  // Set auto-approve flag
  setAutoApprove(value: boolean): void {
    this.autoApprove = value;
  }

  // Get auto-approve status
  shouldAutoApprove(): boolean {
    return this.autoApprove;
  }

  // Prompt the AI coder for more information about the problem
  async promptAICoder(issueId: string): Promise<void> {
    // This function simulates prompting the AI coder and getting a response
    // In a real implementation, this would involve an API call or inter-process communication

    console.log(`Prompting AI coder for more details about issue: ${issueId}`);

    // For simulation, we'll just use a placeholder response
    const aiResponse = await this.getAICoderResponse(issueId);

    // Store the response
    this.issueResponses.set(issueId, aiResponse);

    // Log the action
    this.logAction(
      'info',
      `Prompted AI coder for issue '${issueId}'. Response received.`,
    );
  }

  // Simulated function to get AI coder's response
  private async getAICoderResponse(issueId: string): Promise<string> {
    // Simulate an asynchronous operation
    return new Promise((resolve) => {
      setTimeout(() => {
        const response = `AI coder's explanation for issue '${issueId}'`;
        resolve(response);
      }, 1000);
    });
  }

  // Get the AI coder's response for a specific issue
  getAICoderResponseForIssue(issueId: string): string | undefined {
    return this.issueResponses.get(issueId);
  }

  // Helper function to log actions
  private logAction(
    status: 'success' | 'error' | 'info',
    message: string,
    errorStack?: string,
  ) {
    const logFilePath = path.resolve(process.cwd(), 'action_log.txt');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${status.toUpperCase()}] ${message}${
      errorStack ? `\nStack Trace:\n${errorStack}\n` : ''
    }\n`;
    fs.appendFileSync(logFilePath, logEntry);
  }
}

const problemMonitor = new ProblemMonitor();
export default problemMonitor;
