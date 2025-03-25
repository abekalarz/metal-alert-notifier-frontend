import {LitElement, html} from 'lit';
import {templatesStyles} from './my-element.styles.js';

const itemRuleOperators = [
  {operator: 'IS', label: 'Item is'},
  {operator: 'IS_NOT', label: 'Item is not'},
];

const itemRuleValues = [
  {operator: 'GOLD', label: 'gold'},
  {operator: 'SILVER', label: 'silver'},
  {operator: 'PLATINUM', label: 'platinum'},
];

const priceRuleOperators = [
  {operator: 'EQ', label: 'Price is equal to'},
  {operator: 'GTE', label: 'Price is greater than or equal to'},
  {operator: 'GT', label: 'Price is greater than'},
  {operator: 'LT', label: 'Price is less then'},
  {operator: 'LTE', label: 'Price is less than or equal to'},
];

export class MyElement extends LitElement {
  static properties = {
    allTemplates: {type: Array},
    title: {type: String},
    content: {type: String},
    recipients: {type: Array},
    rules: {type: Object},
    selectedId: {type: String},
  };

  constructor() {
    super();
    this.allTemplates = [
      {id: 1, title: 'Srebro niebezpiecznie tanie!'},
      {id: 2, title: 'Cena złota szaleje'},
      {id: 3, title: 'Platyna droga jak nigdy!'},
    ];
    this.selectedId = '';
    this.title = '';
    this.content = '';
    this.recipients = [];
    this.rules = {};
  }

  static styles = templatesStyles;

  testData1() {
    this.title = 'Srebro niebezpiecznie tanie!';
    this.content = 'Cena srebra spadła poniżej wartości granicznej';
    (this.recipients = ['jan@example.com', 'ania@example.com']),
      (this.rules = {
        item: {
          operator: 'IS',
          value: 'SILVER',
        },
        price: new Map([['LTE', '20.00']]),
      });
  }

  _onUniqueRecipientAddition() {
    const input =
      this.renderRoot.querySelector('[data-role="email-new"]') ?? null;
    const normalizedEmail = (input.value || '').toLowerCase();

    if (
      normalizedEmail.length > 0 &&
      !this.recipients.includes(normalizedEmail)
    ) {
      this.recipients.push(normalizedEmail);
      input.value = '';
    }

    console.log(this.recipients);
    this.requestUpdate();
  }

  _onRecipientDeletion(e) {
    const existingEmail = e.target.previousElementSibling.value ?? null;
    if (existingEmail != null && existingEmail.length > 0) {
      this.removeRecipient(existingEmail);
    }

    this.requestUpdate();
  }

  _onRuleAddition() {
    const root = this.renderRoot;
    const inputItemOperator =
      root.querySelector('[data-role="new-item-rule-operator"]') ?? null;
    const inputItemValue =
      root.querySelector('[data-role="new-item-rule-value"]') ?? null;
    const inputPriceOperator =
      root.querySelector('[data-role="new-price-rule-operator"]') ?? null;
    const inputPriceValue =
      root.querySelector('[data-role="new-price-rule-value"]') ?? null;

    if (
      inputItemOperator.value === '' ||
      inputItemValue.value === '' ||
      inputPriceOperator.value === '' ||
      inputPriceValue.value === '0.00'
    ) {
      return;
    }

    const mergedPriceRules = new Map([
      ...(this.rules.price ?? []),
      [inputPriceOperator.value, inputPriceValue.value],
    ]);

    const rules = {
      item: {
        operator: inputItemOperator.value,
        value: inputItemValue.value,
      },
      price: mergedPriceRules,
    };
    this.rules = rules;
    console.log('Rule added');
    console.log(this.rules);

    inputPriceOperator.value = '';
    inputPriceValue.value = '0.00';

    this.requestUpdate();
  }

  _onRuleDeletion(e) {
    const existingPriceRule =
      e.target.previousElementSibling?.previousElementSibling.value ?? null;

    if (existingPriceRule != null && existingPriceRule.length > 0) {
      this.rules.price = new Map(
        Array.from(this.rules.price ?? []).filter(
          ([operator]) => operator !== existingPriceRule
        )
      );
    }

    console.log('updated rules =');
    console.log(this.rules);

    this.requestUpdate();
  }

  _onTemplateSelection(itemId) {
    this.testData1();
    this.selectedId = itemId;
  }

  removeRecipient(value) {
    this.recipients = this.recipients.filter((item) => item !== value);
  }

  mapRulePriceOperatorToLabel(operator) {
    return priceRuleOperators.find((o) => o.operator === operator)?.label ?? '';
  }

  render() {
    return html`
      <head>
        <meta charset="UTF-8" />
        <title>List-Details - Powiadomienia</title>
      </head>
      <body>
        <div class="container">
          <div class="sidebar">
            <button>Dodaj nowy szablon</button>
            ${this.allTemplates.map(
              (template) =>
                html`
                  <div
                    id=${template.id}
                    data-template-title="${template.title}"
                    class="item ${this.selectedId === template.id
                      ? 'active'
                      : ''}"
                    @click=${() => this._onTemplateSelection(template.id)}
                  >
                    ${template.title}
                  </div>
                `
            )}
          </div>

          <div class="details">
            <div class="section">
              <label for="title">Tytuł</label>
              <input
                type="text"
                id="title"
                size="50"
                placeholder="Tytuł szablonu np. 'Cena złota szaleje'"
                .value=${this.title}
              />
            </div>

            <div class="section">
              <label>Odbiorcy</label>
              <div class="recipients">
                ${this.recipients.map(
                  (email) => html`
                    <div>
                      <input
                        type="email"
                        disabled
                        placeholder="Email"
                        value=${email}
                        .value=${email}
                        pattern=".+@example.com"
                        size="25"
                        required
                        data-email-id=${email}
                      />
                      <button @click=${this._onRecipientDeletion}>Usuń</button>
                    </div>
                  `
                )}
                <hr class="separator" />
                <div>
                  <input
                    type="email"
                    data-role="email-new"
                    placeholder="Email"
                    size="25"
                  />
                </div>
                <button @click=${this._onUniqueRecipientAddition}>
                  Dodaj odbiorcę
                </button>
              </div>
            </div>

            <div class="section">
              <label for="content">Treść</label>
              <textarea
                id="content"
                placeholder="Treść szablonu np. 'Cena złota przekroczyła wartość graniczną, ale nie przekroczyła wartości kosmicznej.'"
                .value=${this.content}
              ></textarea>
            </div>

            <div class="section">
              <label>Reguły wysyłki</label>
              <label for="rules" class="rules-sub-label">Rodzaj metalu</label>

              <div class="rules" id="rules">
                <select data-role="new-item-rule-operator">
                  <option value="">--Please choose an option--</option>
                  ${itemRuleOperators.map(
                    (o) => html`<option value=${o.operator}>${o.label}</option>`
                  )}
                </select>
                <select data-role="new-item-rule-value">
                  <option value="">--Please choose an option--</option>
                  ${itemRuleValues.map(
                    (o) => html`<option value=${o.operator}>${o.label}</option>`
                  )}
                </select>
              </div>
              <label for="rules" class="rules-sub-label">Cena</label>

              ${Array.from(this.rules.price ?? []).map(
                ([operator, value]) => html`
                  <div class="rules">
                    <select>
                      <option value=${operator}>
                        ${this.mapRulePriceOperatorToLabel(operator)}
                      </option>
                    </select>
                    <input
                      type="number"
                      value=${value}
                      .value=${value}
                      step="0.01"
                      disabled
                    />
                    <button @click=${this._onRuleDeletion}>Usuń</button>
                  </div>
                `
              )}
              <hr class="separator" />
              <div class="rules">
                <select data-role="new-price-rule-operator">
                  <option value="">--Please choose an option--</option>
                  ${priceRuleOperators.map(
                    (o) => html`<option value=${o.operator}>${o.label}</option>`
                  )}
                </select>
                <input
                  type="number"
                  value="0.00"
                  step="0.01"
                  data-role="new-price-rule-value"
                />
              </div>
              <button @click=${this._onRuleAddition}>Dodaj regułę</button>
            </div>
          </div>
        </div>
      </body>
    `;
  }
}

window.customElements.define('my-element', MyElement);
