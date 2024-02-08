const App = {
  $: {
    form: document.querySelector("[data-book-form]"),
  },

  init() {
    App.$.form.addEventListener("submit", App.handleSubmit);
  },

  /**
   * @param {Event} event
   */
  async handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(App.$.form);
    const isbn = formData.get("isbn");

    // await fetch("/");
    const data = Object.fromEntries(formData);
    console.log(data);
  },
};

console.log("HELLO");
