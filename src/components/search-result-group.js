import AbstractComponent from './abstract-component';


class SearchResultGroup extends AbstractComponent {
  getTemplate() {
    return `
    <section class="result__group">
      <div class="result__cards"></div>
      <!--Append tasks here-->
    </section>`;
  }
}

export default SearchResultGroup;
