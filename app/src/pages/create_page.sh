#!/bin/bash

# Get the folder name from the first argument
FOLDER_NAME=$1

if [ -z "$FOLDER_NAME" ]; then
  echo "❌ Please provide a folder name."
  exit 1
fi

# Capitalize first letter for component name
CAPITALIZED_NAME="$(tr '[:lower:]' '[:upper:]' <<< ${FOLDER_NAME:0:1})${FOLDER_NAME:1}"

# Create the folder
mkdir -p "$FOLDER_NAME"
echo "📁 Created folder: $FOLDER_NAME"

# Create name.tsx
cat <<EOF > "$FOLDER_NAME/$FOLDER_NAME.tsx"
import './$FOLDER_NAME.css';

export const $CAPITALIZED_NAME = () => {
  return (
    <div className="$FOLDER_NAME">
      {/* TODO: Add content */}
    </div>
  );
};
EOF
echo "✅ Created $FOLDER_NAME.tsx"

# Create name.css
cat <<EOF > "$FOLDER_NAME/$FOLDER_NAME.css"
.$FOLDER_NAME {
  /* TODO: Add styles */
}
EOF
echo "✅ Created $FOLDER_NAME.css"

# Create index.tsx
echo "export * from './$FOLDER_NAME';" > "$FOLDER_NAME/index.tsx"
echo "✅ Created index.tsx"
