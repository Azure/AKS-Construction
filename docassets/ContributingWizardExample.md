# Wizard

This guide shows an example of how to integrate a simple change into the Wizard Web UI.

## The Example

Adding a new parameter to the main.bicep file will require that a corresponding control/parameter are added to the UI. This allows the property to be easily configured by users of the Wizard Web UI, and not just available for users of the bicep file.

## 1. Which tab

It's important to know which tab the parameter belongs on, because this will dictate which file you'll be working on and the appropriate point in the object tree to add your default value.

1. Deploy
1. Cluster
1. AddOns
1. Networking
1. Sample Apps

## 2. Default value

Open the [default control config file](../helper/src/config.json), and locate the section corresponding to the tab (eg. Networking). Add a new key value pair, using the identical parameter name from the bicep and the same default.

## 3. What control

Depending on the type of the parameter, you might want to add a FluentUI control like ChoiceGroup, DropDown, Checkbox etc. There are plenty of samples of these controls being used throughout the codebase. Find an existing use of one of these controls and use it as your reference.

## 4. Adding the control

In the components directory there will be a page for the tab you need to work on.
Locate where is best for the parameter to be added, and paste in the code from Step 3. You'll need to

## 5. Deployment output

Now that the control is working as expected on the page, we need to make sure that it's going to be output in the places that show performing a deployment.

If the feature you're adding is a Preview feature then we need to add this to a specific object so that it can easily be removed by a UI Toggle.

## 6. Test

Either locally or on Codespaces, it's time to fire the application up to make sure that your change works.
Make sure that changing the option of your control has the desired effect on the created Deployment Script output.

## 7. Presets

In the configpresets directory there are different Architectural Approach files which contain multiple configuration presets. It may be appropriate to add the new parameter to these presets.

## 8. UI Tests

It's recommended to add a Playwright test covering the scenarios for the control as appropriate. With complex logic, tests are mandatory.

