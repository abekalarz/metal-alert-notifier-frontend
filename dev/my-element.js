import {LitElement, html} from 'lit';
import {templatesStyles} from './my-element.styles.js';
import {
  createNewTemplateOrUpdate,
  getTemplatesSummary,
  getTemplateById,
  deleteTemplateById,
} from './api/api-service.js';
import {
  itemRuleOperators,
  itemRuleValues,
  priceRuleOperators,
} from './constants.js';

export class MyElement extends LitElement {
  static properties = {
    allTemplates: {type: Array},
    selectedId: {type: String},
    loading: {type: Boolean},

    templateId: {type: String},
    title: {type: String},
    content: {type: String},
    recipients: {type: Array},
    rules: {type: Object},
  };

  constructor() {
    super();
    this.allTemplates = [];
    this.selectedId = '';
    this.loading = true;

    this.templateId = '';
    this.title = '';
    this.content = '';
    this.recipients = [];
    this.rules = {};
  }

  static styles = templatesStyles;

  firstUpdated() {
    this.initializeElement();
  }

  async _onTemplateDeletion() {
    try {
      const deletedTemplate = await deleteTemplateById(this.selectedId);

      if (deletedTemplate.status === 200) {
        this.clearFormFields();
        this.refreshTemplateList();

        this.showSuccessPopup('Template deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
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

    this.requestUpdate();
  }

  async _onTemplateSelection(templateId) {
    try {
      const template = await getTemplateById(templateId);

      this.templateId = template.id;
      this.title = template.title;
      this.content = template.content;
      this.recipients = template.recipients;
      this.rules = {
        item: template.rules.item,
        price: new Map(Object.entries(template.rules.price)),
      };

      const itemRuleOperatorSelect = this.renderRoot.querySelector(
        '[data-role="new-item-rule-operator"]'
      );
      const itemRuleValuesSelect = this.renderRoot.querySelector(
        '[data-role="new-item-rule-value"]'
      );
      itemRuleOperatorSelect.value = this.rules.item.operator;
      itemRuleValuesSelect.value = this.rules.item.value;

      console.log('Template successfully fetched:', template);
    } catch (error) {
      console.error('Error during fetch of template data:', error);
    }

    this.selectedId = templateId;
    this.requestUpdate();
  }

  _onNewTemplateAddition() {
    this.clearFormFields();
    this.requestUpdate();
  }

  async _onTemplateSave() {
    this.validateIfFieldsAreFilled();

    const template = {
      title: this.title,
      content: this.content,
      recipients: this.recipients,
      rules: {
        item: this.rules.item,
        price: Object.fromEntries(this.rules.price ?? []),
      },
    };
    if (this.templateId != null && this.templateId.length > 0) {
      template.id = this.templateId;
    }

    try {
      const savedTemplate = await createNewTemplateOrUpdate(template);
      this.refreshTemplateList();
      this.selectedId = savedTemplate.id;
      this.templateId = savedTemplate.id;

      this.showSuccessPopup('Template saved successfully');
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      this.requestUpdate();
    }
  }

  removeRecipient(value) {
    this.recipients = this.recipients.filter((item) => item !== value);
  }

  mapRulePriceOperatorToLabel(operator) {
    return priceRuleOperators.find((o) => o.operator === operator)?.label ?? '';
  }

  async refreshTemplateList() {
    const summary = await getTemplatesSummary();
    this.allTemplates = summary.summary;
  }

  clearFormFields() {
    this.selectedId = '';
    this.templateId = '';
    this.title = '';
    this.content = '';
    this.recipients = [];
    this.rules = {};

    const itemRuleOperatorSelect = this.renderRoot.querySelector(
      '[data-role="new-item-rule-operator"]'
    );
    const itemRuleValuesSelect = this.renderRoot.querySelector(
      '[data-role="new-item-rule-value"]'
    );
    itemRuleOperatorSelect.value = '';
    itemRuleValuesSelect.value = '';
  }

  async initializeElement() {
    try {
      await this.refreshTemplateList();
      console.log('Template list correctly refreshed: ', this.allTemplates);
    } catch (error) {
      console.error('Template list refreshing failed:', error);
    } finally {
      this.loading = false;
    }
  }

  validateIfFieldsAreFilled() {
    if (
      this.title === '' ||
      this.content === '' ||
      this.recipients.length === 0 ||
      this.rules.item === undefined ||
      this.rules.item.size === 0 ||
      this.rules.price === undefined ||
      this.rules.price.size === 0
    ) {
      const errorMessage = 'Some of the template fields are empty';
      this.showErrorPopup(errorMessage);
      throw new Error('Template is not fully filled');
    }
  }

  showSuccessPopup(successMessage) {
    const popup = this.renderRoot.querySelector('success-popup');
    popup?.show(successMessage);
  }

  showErrorPopup(errorMessage) {
    const popup = this.renderRoot.querySelector('error-popup');
    popup?.show(errorMessage);
  }

  render() {
    if (this.loading) {
      return html`<div>Brak szablonów</div>`;
    }
    return html`
      <head>
        <meta charset="UTF-8" />
        <title>List-Details - Powiadomienia</title>
      </head>
      <body>
        <div class="container">
          <div class="sidebar">
            <button
              class="button positive-button"
              @click=${this._onNewTemplateAddition}
            >
              Dodaj nowy szablon
            </button>
            <hr class="separator main-separator" />

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
                @input=${(e) => (this.title = e.target.value)}
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
                      <button
                        class="button-small warn-button"
                        @click=${this._onRecipientDeletion}
                      >
                        Usuń
                      </button>
                    </div>
                  `
                )}
                <hr class="separator sub-separator" />
                <div>
                  <input
                    type="email"
                    data-role="email-new"
                    placeholder="Email"
                    size="25"
                  />
                </div>
                <button
                  class="button-small positive-button"
                  @click=${this._onUniqueRecipientAddition}
                >
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
                @input=${(e) => (this.content = e.target.value)}
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
                    <button
                      class="button-small warn-button"
                      @click=${this._onRuleDeletion}
                    >
                      Usuń
                    </button>
                  </div>
                `
              )}
              <hr class="separator sub-separator" />
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
              <button
                class="button-small positive-button"
                @click=${this._onRuleAddition}
              >
                Dodaj regułę
              </button>
              <hr class="separator main-separator" />

              <button
                class="button positive-button"
                @click=${this._onTemplateSave}
              >
                ZAPISZ lub EDYTUJ
              </button>
              <button
                class="button danger-button"
                @click=${this._onTemplateDeletion}
              >
                USUŃ
              </button>
            </div>
          </div>
        </div>
        <error-popup></error-popup>
        <success-popup></success-popup>
      </body>
    `;
  }
}

window.customElements.define('my-element', MyElement);
