import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @name ui5.first.controller.TablePanel
 */
export default class TablePanel extends Controller {
  onInit(): void {
    this.getView().setModel( new JSONModel("model/Times.json"));
  }
}
