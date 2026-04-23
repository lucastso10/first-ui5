import MessageToast from "sap/m/MessageToast";
import Controller from "sap/ui/core/mvc/Controller"; 
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @name ui5.first.controller.App
 */
export default class AppController extends Controller {
  onInit(): void {
    const data = {
      recipient: {
	name: "World"
      }
    };
    const dataModel = new JSONModel(data);
    this.getView()?.setModel(dataModel);
  }

  onButtonPress(): void {
    MessageToast.show("Hello!");
  }
};
