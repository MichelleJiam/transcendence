#!/bin/bash

if [ -z "$1" ]
then
	echo "Please specify a name for the folder and files"
	exit
fi

if [[ -d "${PWD}/src/$1" ]]
then
	echo "$1 already exists, folder not created." 
	exit
fi

capitalize()
{
  printf '%s' "$1" | head -c 1 | tr [:lower:] [:upper:]
  printf '%s' "$1" | tail -c '+2'
}

echo "Creating folder and files for: ${PWD}/src/$1"

src="${PWD}/src/$1"
name=$1

# DIRECTORY
mkdir $src

# CONTROLLER
touch $src/$1.controller.ts
echo "import { Controller, Post, Get, Body } from \"@nestjs/common\";
import { $(capitalize "$name")Service } from \"./$name.service\";

@Controller('$name')
export class $(capitalize "$name")Controller {
	constructor(private readonly ${name}Service: $(capitalize "$name")Service) {}
}" >> $src/$1.controller.ts

# SERVICE
touch $src/$1.service.ts
echo "import { Injectable } from \"@nestjs/common\";
import { $(capitalize "$name") } from \"./$name.model\";

@Injectable()
export class $(capitalize "$name")Service {
	
}
" >> $src/$1.service.ts

# MODULE
touch $src/$1.module.ts
echo "import { Module } from \"@nestjs/common\";
import { $(capitalize "$name")Controller } from \"./$name.controller\";
import { $(capitalize "$name")Service } from \"./$name.service\";

@Module({
	controllers: [$(capitalize "$name")Controller],
	providers: [$(capitalize "$name")Service],
})
export class $(capitalize "$name")Module {}" >> $src/$1.module.ts

# MODEL
touch $src/$1.model.ts
echo "export class $(capitalize "$name") {
	constructor (
		){}
}" >> $src/$1.model.ts