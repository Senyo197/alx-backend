import sinon from 'sinon';
import { expect } from 'chai';
import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job';

describe('createPushNotificationsJobs', () => {
  let sandbox;
  let consoleSpy;
  let queue;

  before(() => {
    // Create a sandbox for stubs/spies
    sandbox = sinon.createSandbox();

    // Use sandbox to spy on console methods
    consoleSpy = sandbox.spy(console, 'log');

    // Create a Kue queue in test mode
    queue = createQueue({ name: 'push_notification_code_test' });
    queue.testMode.enter();
  });

  after(() => {
    // Restore console.log
    consoleSpy.restore();

    // Clear test mode and exit
    queue.testMode.clear();
    queue.testMode.exit();

    // Restore sandbox
    sandbox.restore();
  });

  afterEach(() => {
    // Reset console spy history after each test
    consoleSpy.resetHistory();
  });

  it('throws an error if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw('Jobs is not an array');
  });

  it('adds jobs to the queue with the correct type and data', () => {
    const jobInfos = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
      {
        phoneNumber: '98877665544',
        message: 'Use the code 1738 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobInfos, queue);

    // Check if jobs were added to the queue
    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.deep.equal(jobInfos[0]);

    // Check if notification job created messages were logged
    expect(consoleSpy.calledWith('Notification job created:', queue.testMode.jobs[0].id)).to.be.true;
  });

  it('registers the progress event handler for a job', () => {
    queue.testMode.jobs[0].emit('progress', 25);
    expect(consoleSpy.calledWith('Notification job', queue.testMode.jobs[0].id, '25% complete')).to.be.true;
  });

  it('registers the failed event handler for a job', () => {
    queue.testMode.jobs[0].emit('failed', new Error('Failed to send'));
    expect(consoleSpy.calledWith('Notification job', queue.testMode.jobs[0].id, 'failed:', 'Failed to send')).to.be.true;
  });

  it('registers the complete event handler for a job', () => {
    queue.testMode.jobs[0].emit('complete');
    expect(consoleSpy.calledWith('Notification job', queue.testMode.jobs[0].id, 'completed')).to.be.true;
  });
});
