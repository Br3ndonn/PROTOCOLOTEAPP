import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
    padding: 16,
  },

  // Seções
  section: {
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    // boxShadow para web, mantendo o estilo do shadow*
    boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    paddingBottom: 8,
  },

  // Inputs
  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#495057',
  },

  textArea: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#495057',
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Radio buttons
  radioContainer: {
    flexDirection: 'row',
    gap: 16,
  },

  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6c757d',
    backgroundColor: '#ffffff',
  },

  radioSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },

  radioText: {
    fontSize: 16,
    color: '#495057',
  },

  // Switch
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  // Array fields
  arrayFieldContainer: {
    marginBottom: 20,
  },

  arrayFieldTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },

  addItemContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  addItemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#ffffff',
  },

  addItemButton: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
  },

  arrayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  arrayItemText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
  },

  removeItemButton: {
    backgroundColor: '#ffebee',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Buttons
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },

  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },

  saveButton: {
    backgroundColor: '#007AFF',
  },

  clearButton: {
    backgroundColor: '#6c757d',
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  clearButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Error display
  errorContainer: {
    backgroundColor: '#f8d7da',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1aeb5',
  },

  errorText: {
    color: '#721c24',
    fontSize: 14,
    marginBottom: 4,
  },
});
