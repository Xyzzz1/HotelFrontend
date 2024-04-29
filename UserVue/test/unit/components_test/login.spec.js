import { shallowMount } from '@vue/test-utils';
import Login from '../../src/views/login';

describe('<hello-world/>', () => {
  it('should render correct contents', () => {
    const wrapper = shallowMount(HelloWorld);
    expect(wrapper.find('.hello h1').text())
      .toEqual('Welcome to Your Vue.js App');
  });
});