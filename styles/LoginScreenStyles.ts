import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loginContainer: {
    width: Platform.OS === 'web' ? 400 : '90%',
    maxWidth: '95%',
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    alignSelf: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    // boxShadow para web, mantendo o estilo do shadow*
    boxShadow: '0px 2px 3.84px rgba(0,0,0,0.1)',
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2c3e50',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    minHeight: 48,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e1e8ed',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#7f8c8d',
    fontSize: 14,
  },
  linkText: {
    color: '#1976d2',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    // boxShadow para web, mantendo o estilo do shadow*
    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
    elevation: 4,
    marginBottom: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});
