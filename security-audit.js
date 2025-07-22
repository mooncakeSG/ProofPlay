#!/usr/bin/env node

/**
 * ProofPlay Security Audit Script
 * Checks for common security vulnerabilities in the codebase
 */

const fs = require('fs');
const path = require('path');

// Security audit results
const auditResults = {
  passed: [],
  warnings: [],
  critical: [],
  recommendations: []
};

// Check for sensitive data exposure
function checkSensitiveData(filePath, content) {
  // Skip test files for sensitive data checks
  if (filePath.includes('__tests__') || filePath.includes('.test.') || filePath.includes('.spec.')) {
    return;
  }

  const sensitivePatterns = [
    /password\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /api_key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /secret\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /private_key\s*[:=]\s*['"`][^'"`]+['"`]/gi,
    /token\s*[:=]\s*['"`][^'"`]+['"`]/gi,
  ];

  sensitivePatterns.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      auditResults.critical.push({
        file: filePath,
        issue: `Sensitive data found: ${matches[0].substring(0, 50)}...`,
        line: content.substring(0, content.indexOf(matches[0])).split('\n').length
      });
    }
  });
}

// Check for proper error handling
function checkErrorHandling(filePath, content) {
  const errorPatterns = [
    /console\.log\(/g,
    /console\.error\(/g,
    /throw new Error\(/g,
  ];

  errorPatterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      auditResults.warnings.push({
        file: filePath,
        issue: `Error handling found: ${pattern.source}`,
        count: matches.length
      });
    }
  });
}

// Check for input validation
function checkInputValidation(filePath, content) {
  const validationPatterns = [
    /if\s*\([^)]*input[^)]*\)/gi,
    /validate\w*\(/gi,
    /sanitize\w*\(/gi,
  ];

  const hasValidation = validationPatterns.some(pattern => pattern.test(content));
  
  if (!hasValidation && content.includes('function') && content.includes('(')) {
    auditResults.warnings.push({
      file: filePath,
      issue: 'No input validation found in functions',
      recommendation: 'Add input validation for all user inputs'
    });
  }
}

// Check for proper authentication patterns
function checkAuthentication(filePath, content) {
  const authPatterns = [
    /isAuthenticated/gi,
    /user\s*&&/gi,
    /authentication/gi,
  ];

  const hasAuth = authPatterns.some(pattern => pattern.test(content));
  
  if (hasAuth) {
    auditResults.passed.push({
      file: filePath,
      issue: 'Authentication patterns found',
      status: 'GOOD'
    });
  }
}

// Scan directory recursively
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      scanDirectory(filePath);
    } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Run security checks
        checkSensitiveData(filePath, content);
        checkErrorHandling(filePath, content);
        checkInputValidation(filePath, content);
        checkAuthentication(filePath, content);
        
      } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
      }
    }
  });
}

// Main audit function
function runSecurityAudit() {
  console.log('🔒 Starting ProofPlay Security Audit...\n');
  
  // Scan the src directory
  if (fs.existsSync('./src')) {
    scanDirectory('./src');
  }
  
  // Generate report
  console.log('📊 SECURITY AUDIT RESULTS\n');
  console.log('='.repeat(50));
  
  if (auditResults.critical.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES:');
    auditResults.critical.forEach(issue => {
      console.log(`  ❌ ${issue.file}:${issue.line} - ${issue.issue}`);
    });
  }
  
  if (auditResults.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    auditResults.warnings.forEach(issue => {
      console.log(`  ⚠️  ${issue.file} - ${issue.issue}`);
      if (issue.recommendation) {
        console.log(`     💡 Recommendation: ${issue.recommendation}`);
      }
    });
  }
  
  if (auditResults.passed.length > 0) {
    console.log('\n✅ PASSED CHECKS:');
    auditResults.passed.forEach(issue => {
      console.log(`  ✅ ${issue.file} - ${issue.issue}`);
    });
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📈 SUMMARY:`);
  console.log(`  Critical Issues: ${auditResults.critical.length}`);
  console.log(`  Warnings: ${auditResults.warnings.length}`);
  console.log(`  Passed Checks: ${auditResults.passed.length}`);
  
  // Recommendations
  if (auditResults.critical.length > 0) {
    console.log('\n🚨 IMMEDIATE ACTION REQUIRED:');
    console.log('  - Fix all critical issues before deployment');
    console.log('  - Review sensitive data handling');
    console.log('  - Implement proper encryption for sensitive data');
  }
  
  if (auditResults.warnings.length > 0) {
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('  - Add input validation to all user inputs');
    console.log('  - Implement proper error handling');
    console.log('  - Add logging for security events');
    console.log('  - Consider implementing rate limiting');
  }
  
  console.log('\n🔒 Security audit completed!');
}

// Run the audit
runSecurityAudit(); 