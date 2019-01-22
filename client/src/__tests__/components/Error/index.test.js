import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Import Enzyme and Adapter for React for test rendering (shallow(), mount()).
 */
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

/**
 * Import renderer for snapshop test renders
 */
import renderer from 'react-test-renderer';

/**
 * Import the component you are testing.
 */
import ErrorMessage from '../../../components/Error';

/**
 * Configure Adapter to use Enzyme with React
 */
Enzyme.configure({ adapter: new Adapter() });

/**
 * Setup function that defines then returns data to be used in App tests
 * Sets up a mockStore used to mock Store in the App component tests
 *
 * @returns {Object} - Data to be used in App components tests
 */
const setup = () => {
  const error = new Error('This is an error message.');

  return {
    error
  };
};

/**
 * Create a describe block around the component you are testing.
 */
describe('RepositoryItem', () => {
  beforeAll(() => {
    console.log('You can run setup once before all tests in context.');
    console.log('You can do the same thing for teardown with afterAll().');
  });

  beforeEach(() => {
    console.log('You can use this for setup in tests.');
  });

  afterEach(() => {
    console.log('You can use this for teardown in tests.');
  });

  /**
   * Wrap the different types of tests to give more specific setup/teardown if needed.
   */
  describe('Smoke tests', () => {
    beforeEach(() => {
      console.log('Add more specific setup for smoke tests here.');
    });

    it('renders without crashing', () => {
      const { error } = setup();
      const div = document.createElement('div');

      ReactDOM.render(<ErrorMessage error={error} />, div);
    });
  });

  describe('DOM tests', () => {
    console.log('Do the rest of your tests here.');
    console.log('This is where you\'d use shallow() and mount() rendering if needed.');
  });

  describe('Snapshot tests', () => {
    /**
     * As a convention. I like to use test() instead of it() for snapshot tests.
     * test() is an alias for it(), so its just for identifying snapshot tests in files easier.
     */
    test('has a valid snapshot', () => {
      /**
       * Get test data.
       */
      const { error } = setup();

      /**
       * Render the component you are snapshot testing with props.
       */
      const component = renderer.create(
        <ErrorMessage error={error} />
      );

      /**
       * Convert component render to JSON.
       */
      const tree = component.toJSON();

      /**
       * Write your assertion for comparision with saved "image".
       */
      expect(tree).toMatchSnapshot();
    });
  });
});
