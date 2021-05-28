import { FindInPage } from '@material-ui/icons';

describe('check for main components', () => {
  test('renders learn react link', () => {
    const linkElement = FindInPage(/learn react/i);
    expect(linkElement).toBeInTheDocument();
  });
});
