import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import ColumnListItem from "sap/m/ColumnListItem";
import Input from "sap/m/Input";
import ObjectIdentifier from "sap/m/ObjectIdentifier";
import Dialog from "sap/m/Dialog";
import MessageToast from "sap/m/MessageToast";

/**
 * @name ui5.first.controller.TablePanel
 */
export default class TablePanel extends Controller {
  onInit(): void {
    this.getView().setModel(new JSONModel("model/Times.json"));

    this.oTable = this.byId("idTimesTable");
    
    this.oReadOnlyTemplate = this.byId("idTimesTableColumns");
    this.rebindTable(this.oReadOnlyTemplate);

    this.oEditableTemplate = new ColumnListItem({
      cells: [
	new ObjectIdentifier({ title: "{WBS}" }), 
	new Input({ value: "{day1}" }), 
	new Input({ value: "{day2}" }), 
	new Input({ value: "{day3}" }), 
	new Input({ value: "{day4}" }), 
	new Input({ value: "{day5}" }), 
	new Input({ value: "{day6}" }), 
	new Input({ value: "{day7}" }), 
	new Input({ value: "{day8}" }), 
	new Input({ value: "{day9}" }), 
	new Input({ value: "{day10}" }), 
	new Input({ value: "{day11}" }), 
	new Input({ value: "{day12}" }), 
	new Input({ value: "{day13}" }), 
	new Input({ value: "{day14}" }), 
	new Input({ value: "{day15}" })
      ]
    });
  }

  rebindTable(oTemplate : ColumnListItem): void {
    this.oTable.bindItems({
      path: "/Submissions",
      template: oTemplate,
      templateShareable: true,
      key: "WBS"
    });
  }

  onEdit(): void {
    this.byId("addButton").setVisible(false);
    this.byId("editButton").setVisible(false);
    this.byId("saveButton").setVisible(true);

    this.rebindTable(this.oEditableTemplate);
  }

  onSave(): void {
    this.byId("addButton").setVisible(true);
    this.byId("editButton").setVisible(true);
    this.byId("saveButton").setVisible(false);
    
    this.rebindTable(this.oReadOnlyTemplate);
  }

  async onAdd(): Promise<void> {
    this.dialog ??= await this.loadFragment({
      name: "ui5.first.view.AddWBS"
    }) as Dialog;
    this.dialog.open(); 
  }

  onCancelDialog(): void {
    this.byId("wbsComboBox").clearSelection();
    (this.byId("idAddDialog") as Dialog)?.close();
  }

  onSubmitDialog(): void {
    var oComboBox = this.byId("wbsComboBox");
    var oModel = this.getView().getModel();
    
    var sWBS = oComboBox.getSelectedKey();
    if (!sWBS) {
      var sWBS = oComboBox.getValue();

      if (!sWBS) {
          MessageToast.show("Please enter a WBS code.");
          return;
      }
    }
    console.log(sWBS);

    var aSubmissions = oModel.getProperty("/Submissions");

    // Check if this WBS is already in the table
    var bAlreadyAdded = aSubmissions.some((entry) => entry.WBS === sWBS);
    if (bAlreadyAdded) {
        MessageToast.show("This WBS is already in the table.");
        return;
    }
    

    // If it's a new WBS not in Projects list, add it there too
    var aProjects = oModel.getProperty("/Projects");
    var bExists = aProjects.some((project) => project.WBS === sWBS);
    if (!bExists) {
        aProjects.push({ WBS: sWBS, Description: sWBS });
        oModel.setProperty("/Projects", aProjects);
    }

    aSubmissions.push({
        WBS: sWBS,
        day1: 0, day2: 0, day3: 0, day4: 0, day5: 0,
        day6: 0, day7: 0, day8: 0, day9: 0, day10: 0,
        day11: 0, day12: 0, day13: 0, day14: 0, day15: 0
    });

    oModel.setProperty("/Submissions", aSubmissions); 

    this.byId("wbsComboBox").clearSelection();
    (this.byId("idAddDialog") as Dialog)?.close();
  }

  async onSubmitFinal(): Promise<void> {
    var oModel = this.getView().getModel();
    var aSubmissions = oModel.getProperty("/Submissions");

    var iTotalHours = 0;
    console.log(aSubmissions);
    aSubmissions.forEach((entry) => {
        for (var i = 1; i <= 15; i++) {
            iTotalHours += Number(entry["day" + i]) || 0;
        }
    });

    this.dialog ??= await this.loadFragment({
      name: "ui5.first.view.Submit"
    }) as Dialog;
    this.dialog.open(); 

    this.byId("totalHoursTitle").setText(iTotalHours + "h/88h");
   
    this.byId("idOTSubmit").setVisible(true);
    this.byId("totalHoursTitleOT").setVisible(true);
    this.byId("totalHoursTitleOT").setText( (iTotalHours - 88) + "h OT");

  }
  
}
