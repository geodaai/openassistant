#!/bin/bash

# Script to add SPDX license headers to JavaScript and C++ files
# Usage: ./add_license.sh [directory]
# If no directory is specified, uses the current directory

set -e

# License header to add
LICENSE_HEADER="// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project"

# Function to check if file already has the license header
has_license_header() {
    local file="$1"
    
    # Check if file exists and is readable
    if [ ! -f "$file" ] || [ ! -r "$file" ]; then
        return 1  # No license header (file doesn't exist or isn't readable)
    fi
    
    # Read the first few lines to check for existing license headers
    local first_lines=$(head -n 10 "$file" 2>/dev/null)
    
    # Check for SPDX license identifier
    if echo "$first_lines" | grep -q "SPDX-License-Identifier: MIT"; then
        return 0  # Has license header
    fi
    
    # Check for other common license header patterns
    if echo "$first_lines" | grep -q "Copyright contributors to the openassistant project"; then
        return 0  # Has license header
    fi
    
    # Check for other SPDX identifiers that might already be present
    if echo "$first_lines" | grep -q "SPDX-License-Identifier:"; then
        return 0  # Has some license header (don't overwrite)
    fi
    
    return 1  # No license header
}

# Function to check if file starts with a shebang
has_shebang() {
    local file="$1"
    if head -n 1 "$file" 2>/dev/null | grep -q "^#!"; then
        return 0  # Has shebang
    else
        return 1  # No shebang
    fi
}

# Function to add license header to a file
add_license_to_file() {
    local file="$1"
    local temp_file=$(mktemp)
    
    # Check if file has a shebang line
    if has_shebang "$file"; then
        # Preserve shebang, add license header, then rest of file
        head -n 1 "$file" > "$temp_file"
        echo "" >> "$temp_file"
        echo "$LICENSE_HEADER" >> "$temp_file"
        echo "" >> "$temp_file"
        tail -n +2 "$file" >> "$temp_file"
    else
        # Add license header at the beginning
        echo "$LICENSE_HEADER" > "$temp_file"
        echo "" >> "$temp_file"
        cat "$file" >> "$temp_file"
    fi
    
    mv "$temp_file" "$file"
    
    echo "Added license header to: $file"
}



# Function to process files in a directory
process_directory() {
    local dir="$1"
    local count=0
    
    echo "Processing directory: $dir"
    
    # Get all tracked files from git and filter by extension
    while IFS= read -r file; do
        # Skip if file is not in the target directory
        if [[ "$file" != "$dir"* ]]; then
            continue
        fi
        
        # Check if it's a JavaScript file
        if [[ "$file" =~ \.(js|ts|jsx|tsx|mjs)$ ]]; then
            if ! has_license_header "$file"; then
                add_license_to_file "$file"
                ((count++))
            else
                echo "Skipping (already has license): $file"
            fi
        fi
        
        # Check if it's a C++ file
        if [[ "$file" =~ \.(cpp|h|hpp|cc|cxx)$ ]]; then
            if ! has_license_header "$file"; then
                add_license_to_file "$file"
                ((count++))
            else
                echo "Skipping (already has license): $file"
            fi
        fi
    done < <(git ls-files "$dir" 2>/dev/null || git ls-files | grep "^$dir")
    
    echo "Processed $count files in $dir"
    return $count
}

# Main script
main() {
    local target_dir="${1:-.}"
    local total_processed=0
    
    echo "Adding SPDX license headers to JavaScript and C++ files"
    echo "Target directory: $target_dir"
    echo "License header:"
    echo "$LICENSE_HEADER"
    echo ""
    
    if [ ! -d "$target_dir" ]; then
        echo "Error: Directory '$target_dir' does not exist"
        exit 1
    fi
    
    # Process the target directory
    process_directory "$target_dir"
    total_processed=$?
    
    echo ""
    echo "Summary:"
    echo "Total files processed: $total_processed"
    echo "License headers added to JavaScript and C++ files in: $target_dir"
}

# Run the script
main "$@"
